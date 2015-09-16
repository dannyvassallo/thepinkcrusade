class PinMailer < ActionMailer::Base
  def posted_confirmation(pin)
    @pin = pin
    mail :to => ENV['PIN_EMAIL'], :from => "noreply@thepinkcrusade.herokuapp.com", :subject => "PINKCRUSADE15: Someone dropped a pin!"
  end
end
