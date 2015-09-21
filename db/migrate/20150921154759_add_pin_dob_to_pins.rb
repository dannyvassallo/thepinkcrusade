class AddPinDobToPins < ActiveRecord::Migration
  def change
    add_column :pins, :pin_dob, :string
  end
end
