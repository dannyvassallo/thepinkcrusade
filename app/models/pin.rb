class Pin < ActiveRecord::Base
  validates_presence_of :pin_first_name
  validates_presence_of :pin_last_name
  validates_presence_of :pin_email
  validates_presence_of :pin_comment
  validates_presence_of :pin_zip
  validates_presence_of :pin_app_name

  def self.search(search)
    Pin.where("lower(pin_first_name || ' ' || pin_last_name || ' ' || pin_comment || ' ' || pin_email || ' ' || pin_app_name) LIKE ?", "%#{search.downcase}%")
  end

end





