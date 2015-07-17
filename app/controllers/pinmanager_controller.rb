class PinmanagerController < ApplicationController

  def index
    @user = current_user
    result_num = 1
    if @user != nil && @user.admin?
      @pins = Pin.all.paginate(:page => params[:page], :per_page => result_num)
      if params[:search]
        @pins = Pin.search(params[:search]).order("created_at DESC").paginate(:page => params[:page], :per_page => result_num)
      else
        @posts = Pin.all.order('created_at DESC').paginate(:page => params[:page], :per_page => result_num)
      end
    else
      redirect_to root_path
    end
  end

end
