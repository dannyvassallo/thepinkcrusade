class PinmanagerController < ApplicationController

  def index
    @pins = Pin.all
    if params[:search]
      @pins = Pin.search(params[:search]).order("created_at DESC")
    else
      @posts = Pin.all.order('created_at DESC')
    end
  end

end
