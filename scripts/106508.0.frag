
for (O *= i = 0.; i < 2e2; i += .5) 
O += .0006/abs(length(u + vec2(cos(i/4. + T), sin(i*.45 + T)) * sin(T*.5+i*.35)) - sin(i+T*.5) / 60. - .01) * (1. + cos(i*.7 + T + length(u)*6. + vec4(0,1,2,0)));
