class PinmanagerController < ApplicationController

  def index
    @user = current_user
    if @user != nil && @user.admin?
      @pins = Pin.all
      if params[:search]
        @pins = Pin.search(params[:search]).order("created_at DESC")
      else
        @posts = Pin.all.order('created_at DESC')
      end
    else
      redirect_to root_path
    end
  end

end
