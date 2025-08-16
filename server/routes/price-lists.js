// Price Lists API routes

// Pricing Calculations
class PricingCalculator {
  static calculateMargin(costPrice, sellingPrice) {
    if (costPrice <= 0) return 0;
    return ((sellingPrice - costPrice) / costPrice) * 100;
  }

  static calculateSuggestedPrice(costPrice, targetMargin) {
    return costPrice * (1 + (targetMargin / 100));
  }

  static validateMinimumMargin(costPrice, sellingPrice, minimumMargin) {
    const actualMargin = this.calculateMargin(costPrice, sellingPrice);
    return actualMargin >= minimumMargin;
  }

  static applyPricingRule(costPrice, rule) {
    switch (rule.ruleType) {
      case 'margin_percent':
        return costPrice * (1 + (rule.ruleValue / 100));
      case 'markup_percent':
        return costPrice + (costPrice * (rule.ruleValue / 100));
      case 'fixed_amount':
        return costPrice + rule.ruleValue;
      default:
        return costPrice;
    }
  }
}

// Product Matcher
class ProductMatcher {
  static async findMatches(priceListItem, supplierId, db) {
    // Method 1: Exact SKU match (highest confidence)
    if (priceListItem.supplierSku) {
      const exactMatch = await this.findByExactSKU(priceListItem.supplierSku, supplierId, db);
      if (exactMatch) {
        return { product: exactMatch, confidence: 100, method: 'exact_sku' };
      }
    }

    // Method 2: Model + Type + Material match (high confidence)
    if (priceListItem.model && priceListItem.type && priceListItem.material) {
      const modelMatch = await this.findByModelTypeMaterial(
        priceListItem.model, 
        priceListItem.type, 
        priceListItem.material,
        supplierId,
        db
      );
      if (modelMatch) {
        return { product: modelMatch, confidence: 90, method: 'model_type_material' };
      }
    }

    // Method 3: Fuzzy description match (medium confidence)
    if (priceListItem.description) {
      const fuzzyMatch = await this.findByFuzzyDescription(priceListItem.description, supplierId, db);
      if (fuzzyMatch) {
        return { product: fuzzyMatch, confidence: 70, method: 'fuzzy_description' };
      }
    }

    return { product: null, confidence: 0, method: 'none' };
  }

  static async findByExactSKU(sku, supplierId, db) {
    try {
      const query = "SELECT * FROM products WHERE sku = $1 AND supplier_id = $2 LIMIT 1";
      const result = await db.query(query, [sku, supplierId]);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding product by SKU:", error);
      return null;
    }
  }

  static async findByModelTypeMaterial(model, type, material, supplierId, db) {
    try {
      const query = "SELECT * FROM products WHERE model = $1 AND type = $2 AND material = $3 AND supplier_id = $4 LIMIT 1";
      const result = await db.query(query, [model, type, material, supplierId]);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding product by model/type/material:", error);
      return null;
    }
  }

  static async findByFuzzyDescription(description, supplierId, db) {
    try {
      // Simplified fuzzy matching - in production would use full-text search
      const firstWord = description.split(' ')[0];
      const query = "SELECT * FROM products WHERE name ILIKE $1 AND supplier_id = $2 LIMIT 1";
      const result = await db.query(query, [`%${firstWord}%`, supplierId]);
      return result.rows[0];
    } catch (error) {
      console.error("Error finding product by fuzzy description:", error);
      return null;
    }
  }
}

// CSV Processor
const SUPPLIER_FORMATS = {
  'gplan': {
    supplier: 'G-Plan Furniture',
    columns: {
      'Material': 'material',
      'Model': 'model', 
      'Type': 'type',
      'Cost Price': 'costPrice',
      'Selling Price': 'sellingPrice'
    },
    skipRows: 1,
    requiredColumns: ['Material', 'Model', 'Type', 'Cost Price']
  },
  'parker-knoll': {
    supplier: 'Parker Knoll',
    columns: {
      'Product Code': 'supplierSku',
      'Description': 'description',
      'Trade Price': 'costPrice',
      'RRP': 'sellingPrice'
    },
    skipRows: 2,
    requiredColumns: ['Product Code', 'Trade Price']
  },
  'alstons': {
    supplier: 'Alstons Upholstery',
    columns: {
      'Code': 'supplierSku',
      'Item': 'description',
      'Model': 'model',
      'Fabric': 'material',
      'Net Price': 'costPrice',
      'Retail Price': 'sellingPrice'
    },
    skipRows: 0,
    requiredColumns: ['Code', 'Net Price']
  }
};

class CSVProcessor {
  static async processPriceList(csvText, supplierId, formatKey) {
    const format = SUPPLIER_FORMATS[formatKey];
    if (!format) {
      throw new Error(`Unknown supplier format: ${formatKey}`);
    }

    const lines = csvText.split('\n');
    const headers = lines[format.skipRows || 0].split(',').map(h => h.trim());
    
    const items = [];
    const errors = [];
    let validRows = 0;
    let errorRows = 0;

    for (let i = (format.skipRows || 0) + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const item = this.parseRow(values, headers, format, i + 1);
        
        // Validate required fields
        const validation = this.validateRow(item, format);
        if (validation.isValid) {
          items.push({
            ...item,
            rowNumber: i + 1,
            supplierId,
            status: 'pending'
          });
          validRows++;
        } else {
          errors.push(`Row ${i + 1}: ${validation.errors.join(', ')}`);
          errorRows++;
        }
      } catch (error) {
        errors.push(`Row ${i + 1}: Failed to parse - ${error.message}`);
        errorRows++;
      }
    }

    return {
      items,
      errors,
      summary: {
        totalRows: lines.length - (format.skipRows || 0) - 1,
        validRows,
        errorRows
      }
    };
  }

  static parseRow(values, headers, format, rowNumber) {
    const item = { rowNumber };
    
    headers.forEach((header, index) => {
      const mappedField = format.columns[header];
      if (mappedField && values[index]) {
        let value = values[index];
        
        // Parse price fields
        if (mappedField.includes('Price') || mappedField === 'costPrice' || mappedField === 'sellingPrice') {
          value = value.replace(/[£$,]/g, '');
          item[mappedField] = parseFloat(value) || 0;
        } else {
          item[mappedField] = value;
        }
      }
    });

    return item;
  }

  static validateRow(item, format) {
    const errors = [];

    // Check required columns
    format.requiredColumns.forEach(col => {
      const field = format.columns[col];
      if (!item[field] || (typeof item[field] === 'string' && item[field].trim() === '')) {
        errors.push(`Missing required field: ${col}`);
      }
    });

    // Validate price fields
    if (item.costPrice && (item.costPrice <= 0 || item.costPrice > 100000)) {
      errors.push('Invalid cost price');
    }

    if (item.sellingPrice && (item.sellingPrice <= 0 || item.sellingPrice > 100000)) {
      errors.push('Invalid selling price');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = function(app, db) {
  // Get price list imports
  app.get("/api/price-list-imports", async (req, res) => {
    const { supplier, status } = req.query;
    
    try {
      let query = `
        SELECT pli.*, s.name as supplier_name
        FROM price_list_imports pli
        LEFT JOIN suppliers s ON pli.supplier_id = s.id
      `;
      
      const params = [];
      const conditions = [];
      
      if (supplier && supplier !== "all") {
        conditions.push(`pli.supplier_id = $${params.length + 1}`);
        params.push(parseInt(supplier));
      }
      
      if (status && status !== "all") {
        conditions.push(`pli.status = $${params.length + 1}`);
        params.push(status);
      }
      
      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }
      
      query += ` ORDER BY pli.import_date DESC`;
      
      const result = await db.query(query, params);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching price list imports:", error);
      res.status(500).json({ error: "Failed to fetch imports" });
    }
  });

  // Get price list items for a specific import
  app.get("/api/price-list-items/:importId", async (req, res) => {
    try {
      const { importId } = req.params;
      
      const query = `
        SELECT * FROM price_list_items
        WHERE import_id = $1
        ORDER BY row_number ASC
      `;
      
      const result = await db.query(query, [importId]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching price list items:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  // Upload and process price list
  app.post("/api/price-list-imports", async (req, res) => {
    try {
      const { supplierId, format } = req.body;
      const file = req.file;

      if (!file || !supplierId || !format) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create import record
      const query = `
        INSERT INTO price_list_imports (
          supplier_id, file_name, file_size, original_file_path, 
          status, imported_by
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `;
      
      const result = await db.query(query, [
        parseInt(supplierId),
        file.originalname,
        file.size,
        file.path,
        'processing',
        req.user?.id || 1 // Default to user ID 1 if no auth
      ]);
      
      const importId = result.rows[0].id;

      // Process CSV in background (simplified - would use queue in production)
      processCSVFile(importId, file.path, format, parseInt(supplierId), db);

      res.json({ importId, status: 'processing' });
    } catch (error) {
      console.error("Error uploading price list:", error);
      res.status(500).json({ error: "Failed to upload price list" });
    }
  });

  // Approve price list import
  app.post("/api/price-list-imports/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Update import status
      const updateQuery = `
        UPDATE price_list_imports
        SET status = 'approved', review_date = NOW(), reviewed_by = $1
        WHERE id = $2
      `;
      
      await db.query(updateQuery, [req.user?.id || 1, parseInt(id)]);

      // Apply price changes
      await applyPriceChanges(parseInt(id), db);

      res.json({ success: true });
    } catch (error) {
      console.error("Error approving price list:", error);
      res.status(500).json({ error: "Failed to approve price list" });
    }
  });

  // Reject price list import
  app.post("/api/price-list-imports/:id/reject", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Update import status
      const updateQuery = `
        UPDATE price_list_imports
        SET status = 'rejected', review_date = NOW(), reviewed_by = $1
        WHERE id = $2
      `;
      
      await db.query(updateQuery, [req.user?.id || 1, parseInt(id)]);

      res.json({ success: true });
    } catch (error) {
      console.error("Error rejecting price list:", error);
      res.status(500).json({ error: "Failed to reject price list" });
    }
  });
};

// Helper functions
async function processCSVFile(importId, filePath, format, supplierId, db) {
  try {
    // Update status to processing
    await db.query(
      "UPDATE price_list_imports SET status = 'processing' WHERE id = $1",
      [importId]
    );

    // Process CSV file
    const fs = require('fs').promises;
    const csvData = await fs.readFile(filePath, 'utf-8');
    const { items, errors, summary } = await CSVProcessor.processPriceList(csvData, supplierId, format);

    // Insert price list items
    if (items.length > 0) {
      const itemsWithMatching = await Promise.all(
        items.map(async (item) => {
          const match = await ProductMatcher.findMatches(item, supplierId, db);
          return {
            ...item,
            importId,
            matchedProductId: match.product?.id,
            matchConfidence: match.confidence,
            matchMethod: match.method,
            currentCostPrice: match.product?.cost_price,
            currentSellingPrice: match.product?.selling_price,
            marginPercent: match.product ? 
              PricingCalculator.calculateMargin(item.costPrice, match.product.selling_price) : 0
          };
        })
      );

      // Insert items into database
      for (const item of itemsWithMatching) {
        await db.query(
          `INSERT INTO price_list_items (
            import_id, row_number, supplier_id, supplier_sku, model, type, material, 
            description, current_cost_price, new_cost_price, current_selling_price, 
            margin_percent, matched_product_id, match_confidence, match_method, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [
            importId, item.rowNumber, supplierId, item.supplierSku, item.model, 
            item.type, item.material, item.description, item.currentCostPrice, 
            item.costPrice, item.currentSellingPrice, item.marginPercent, 
            item.matchedProductId, item.matchConfidence, item.matchMethod, 
            item.matchedProductId ? 'matched' : 'unmatched'
          ]
        );
      }
    }

    // Update import record
    await db.query(
      `UPDATE price_list_imports 
       SET status = 'review', total_rows = $1, valid_rows = $2, error_rows = $3 
       WHERE id = $4`,
      [summary.totalRows, summary.validRows, summary.errorRows, importId]
    );

  } catch (error) {
    console.error("Error processing CSV:", error);
    
    await db.query(
      "UPDATE price_list_imports SET status = 'rejected', notes = $1 WHERE id = $2",
      [error.message, importId]
    );
  }
}

async function applyPriceChanges(importId, db) {
  try {
    // Get approved price list items
    const itemsResult = await db.query(
      `SELECT * FROM price_list_items 
       WHERE import_id = $1 AND status = 'matched' AND matched_product_id IS NOT NULL`,
      [importId]
    );

    const items = itemsResult.rows;

    // Apply price changes
    for (const item of items) {
      const productResult = await db.query(
        "SELECT * FROM products WHERE id = $1 LIMIT 1",
        [item.matched_product_id]
      );

      if (productResult.rows.length > 0) {
        const oldProduct = productResult.rows[0];
        
        // Update product prices
        await db.query(
          "UPDATE products SET cost_price = $1, updated_at = NOW() WHERE id = $2",
          [item.new_cost_price, item.matched_product_id]
        );

        // Record price change history
        await db.query(
          `INSERT INTO price_change_history (
            product_id, import_id, change_type, old_cost_price, new_cost_price,
            old_selling_price, new_selling_price, reason, changed_by
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            item.matched_product_id, importId, 'cost_price', 
            oldProduct.cost_price, item.new_cost_price,
            oldProduct.selling_price, oldProduct.selling_price, // Keeping same for now
            'supplier_update', 1 // System user
          ]
        );
      }
    }

    // Update import status
    await db.query(
      `UPDATE price_list_imports 
       SET status = 'applied', applied_date = NOW(), applied_by = $1 
       WHERE id = $2`,
      [1, importId] // System user
    );

  } catch (error) {
    console.error("Error applying price changes:", error);
    throw error;
  }
}