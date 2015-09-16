#The Pink Crusade

Pink crusade app with drag and drop dedications for SBMC

###Getting Started
Set it up!
```
git clone https://github.com/dannyvassallo/thepinkcrusade.git
cd thepinkcrusade
bundle install
rake db:migrate
rails s
```

###Embed The Widget
```
<style>iframe#tpc-widget {height:850px;width:810px;overflow:hidden;border:none;}</style>
<iframe id="tpc-widget" src="..."></iframe>
```

#### Different App Landings

SBMC(current landing page)
```
http://localhost:3000/
http://localhost:3000/sbmc
```

SBMC Ipad Version(Lite)
```
http://localhost:3000/sbmc-ipad
```

Barnabas Health
```
http://localhost:3000/barnabas-health
```