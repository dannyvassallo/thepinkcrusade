# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150716144439) do

  create_table "pins", force: :cascade do |t|
    t.integer  "pin_pk"
    t.integer  "pin_pin_promo_fk"
    t.string   "pin_comment"
    t.string   "pin_first_name"
    t.string   "pin_last_name"
    t.string   "pin_email"
    t.integer  "pin_zip"
    t.integer  "pin_x"
    t.integer  "pin_y"
    t.boolean  "pin_can_email"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

end
