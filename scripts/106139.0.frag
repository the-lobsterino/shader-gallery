#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
vec2 uv = ( gl_FragCoord.xy / resolution.xy)*2.-1.;
float vignette;
float ex=0.;
float t=time;
if(t>10.) t=time*0.;
//10 vignettes by juhaxgames
ex=floor(t);
if(ex==0.) { uv.x*=uv.x;uv.y*=uv.y;
vignette =  smoothstep(1.5,0.5,length(uv));
}
	
if(ex==1.) {uv.x*=uv.x;uv.y*=uv.y;
vignette =  smoothstep(.5,0.95,length(uv));
}

if(ex==2.) {uv.x*=uv.x*1.75;uv.y*=uv.y*-1.;
vignette =  smoothstep(1.5,.25,length(uv));
}

if(ex==3.) {uv.x*=uv.x;uv.y*=uv.y;
vignette =  smoothstep(1.,0.5,length(uv));
}

if(ex==4.) {uv.x*=uv.x*1.5;uv.y*=uv.y;
vignette =  smoothstep(1.5,0.,length(uv));
}

if(ex==5.) { uv.x*=uv.x;uv.y*=uv.y;
vignette =  smoothstep(2.5,0.125,length(uv));
}

if(ex==6.) {uv.x*=1.5*uv.x;uv.y*=uv.y;
vignette =  smoothstep(1.5,0.25,length(uv));
}
if(ex==7.) {uv.x*=.5*uv.x;uv.y*=uv.y*1.5;
vignette =  smoothstep(1.5,0.25,length(uv));
}

if(ex==8.) {uv.x*=uv.x;uv.y*=uv.y;
vignette =  smoothstep(.5,1.25,length(uv));
}
	
if(ex==9.) {uv.x*=uv.x*0.25;uv.y*=uv.y*-1.75;
vignette =  smoothstep(1.25,.125,length(uv));
}

gl_FragColor = vec4( vec3(vignette), 1.0 );
}