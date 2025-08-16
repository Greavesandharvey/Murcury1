-- Optimize database with indexes
CREATE INDEX IF NOT EXISTS idx_price_list_imports_supplier_id ON price_list_imports(supplier_id);
CREATE INDEX IF NOT EXISTS idx_price_list_items_import_id ON price_list_items(import_id);
CREATE INDEX IF NOT EXISTS idx_price_list_items_product_id ON price_list_items(product_id);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_supplier_id ON pricing_rules(supplier_id);
CREATE INDEX IF NOT EXISTS idx_price_change_history_item_id ON price_change_history(item_id);
