class Api::V1::PinsController < ApplicationController

  skip_before_action :verify_authenticity_token
  respond_to :json


  def index
    @pins = Pin.all
    respond_with @pins
  end

  def new
    @pin = Pin.new
  end

  def create
    @pin = Pin.new(pin_params)
    if @pin.save
      render json: @pin
      PinMailer.posted_confirmation(@pin).deliver
    end
  end

  private

  def pin_params
    params.require(:pin).permit(:pin_pin_promo_fk, :pin_comment, :pin_first_name, :pin_last_name, :pin_email, :pin_zip, :pin_x, :pin_y, :pin_can_email, :pin_app_name) if params[:pin]
  end

end
