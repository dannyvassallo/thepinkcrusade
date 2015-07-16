require 'rails_helper'

describe 'create pin api' do
  it 'creates a pin' do

    post "/api/v1/pins", {"pin" => {"pin_first_name" => "Pin 1"}}

    expect(response.status).to eq(200)
    expect(response.content_type).to eq("application/json")
    json = JSON.parse(response.body, symbolize_names: true)
    expect(json[:pin_first_name]).to eq("Pin 1")
    expect(Pin.last.pin_first_name).to eq("Pin 1")
  end
end
