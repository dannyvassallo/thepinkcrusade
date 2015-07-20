class PinMailer < ActionMailer::Base
  def posted_confirmation(pin)
    @pin = pin
    mail :to => ENV['PIN_EMAIL'], :from => "noreply@rotr15.herokuapp.com", :subject => "ROTR15: Someone dropped a pin!"
  end
end
