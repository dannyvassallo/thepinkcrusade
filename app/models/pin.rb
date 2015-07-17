class Pin < ActiveRecord::Base

  def self.search(search)
    where("pin_first_name LIKE ?", "%#{search}%")
    where("pin_last_name LIKE ?", "%#{search}%")
    where("pin_comment LIKE ?", "%#{search}%")
    where("pin_email LIKE ?", "%#{search}%")
  end

end
