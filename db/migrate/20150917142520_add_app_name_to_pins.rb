class AddAppNameToPins < ActiveRecord::Migration
  def change
    add_column :pins, :app_name, :string
  end
end
