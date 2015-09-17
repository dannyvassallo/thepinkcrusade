class AddAppNameToPins < ActiveRecord::Migration
  def change
    add_column :pins, :pin_app_name, :string
  end
end
