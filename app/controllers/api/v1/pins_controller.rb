class Api::V1::PinsController < ApplicationController

  respond_to :json

  def index
    @pins = Pin.all
    respond_with @pins
  end

  def new
    @pin = Pin.new
  end

  def create
    @pin = Pin.build(pin_params)
    @pin.save!
    respond_with @pin
  end

  def destroy
    respond_with Pin.destroy(params[:id])
  end

  def show
    @pins = Pin.all
    respond_with @pins
  end

  private

  def pin_params
    params.require(:pin).permit(:pin_pk, :pin_pin_promo_fk, :pin_comment, :pin_first_name, :pin_last_name, :pin_email, :pin_zip, :pin_x, :pin_y, :pin_can_email)
  end

end
