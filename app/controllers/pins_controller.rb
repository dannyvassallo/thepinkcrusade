class PinsController < ApplicationController

  # skip_before_action :verify_authenticity_token
  respond_to :html, :js

  def index
    @pins = Pin.all
    respond_to do |format|
      format.html
      format.csv do
        headers['Content-Disposition'] = "attachment; filename=\"rotr15-pins-list\""
        headers['Content-Type'] ||= 'text/csv'
      end
    end
  end

  def manage_pins
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
    @pin = Pin.find(params[:id])

    if @pin.destroy
      flash[:notice] = "Pin was deleted."

    else
      flash[:error] = "Error deleting pin. Please try again."
    end

    respond_with(@pin) do |format|
      format.html { redirect_to pinmanager_index_path }
    end

    authorize @pin
  end

  def show
    @pins = Pin.all
  end

  private

  def pin_params
    params.require(:pin).permit(:pin_pin_promo_fk, :pin_comment, :pin_first_name, :pin_last_name, :pin_email, :pin_zip, :pin_x, :pin_y, :pin_can_email)
  end

end
