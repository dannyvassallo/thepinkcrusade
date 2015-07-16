class CreatePins < ActiveRecord::Migration
  def change
    create_table :pins do |t|
      t.integer :pin_pk
      t.integer :pin_pin_promo_fk
      t.string :pin_comment
      t.string :pin_first_name
      t.string :pin_last_name
      t.string :pin_email
      t.integer :pin_zip
      t.integer :pin_x
      t.integer :pin_y
      t.boolean :pin_can_email

      t.timestamps null: false
    end
  end
end
