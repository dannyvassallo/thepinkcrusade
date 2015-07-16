class PinsController < ApplicationController

  skip_before_action :verify_authenticity_token

  def index
    @pins = Pin.all
  end

  def new
    @pin = Pin.new
  end

  def create
    @pin = Pin.build(pin_params)
    @pin.save!
  end

  def destroy
    Pin.destroy(params[:id])
  end

  def show
    @pins = Pin.all
  end

  private

  def pin_params
    params.require(:pin).permit(:pin_pin_promo_fk, :pin_comment, :pin_first_name, :pin_last_name, :pin_email, :pin_zip, :pin_x, :pin_y, :pin_can_email)
  end

end
