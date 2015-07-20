class Pin < ActiveRecord::Base
  validates_presence_of :pin_first_name
  validates_presence_of :pin_last_name
  validates_presence_of :pin_email
  validates_presence_of :pin_comment
  validates_presence_of :pin_zip

  def self.search(search)
    Pin.where("lower(pin_first_name || ' ' || pin_last_name || ' ' || pin_comment || ' ' || pin_email) LIKE ?", "%#{search.downcase}%")
  end

end





