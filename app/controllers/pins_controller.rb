class PinsController < ApplicationController

  # skip_before_action :verify_authenticity_token
  respond_to :html, :js

  def index
    if params[:search]
      @pins = Pin.search(params[:search]).order("created_at DESC")
    else
      @pins = Pin.all.order('created_at DESC')
    end
    respond_to do |format|
      now = DateTime.now.utc
      now = now.in_time_zone('Eastern Time (US & Canada)')      
      day_and_month = now.strftime("%m-%d")
      time = now.strftime('%I%M')
      format.html
      format.csv do
        headers['Content-Disposition'] = "attachment; filename=\"pinkcrusade-15-pins-list-#{day_and_month}-#{time}\".csv"
        headers['Content-Type'] ||= 'text/csv'
      end
    end
  end

  def sbmc
    @pins = Pin.all
  end

  def sbmc_ipad
    @pins = Pin.all
  end  

  def barnabas_health
    @pins = Pin.all
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
    params.require(:pin).permit(:pin_pin_promo_fk, :pin_comment, :pin_first_name, :pin_last_name, :pin_email, :pin_zip, :pin_x, :pin_y, :pin_can_email, :pin_app_name, :pin_dob)
  end

end
