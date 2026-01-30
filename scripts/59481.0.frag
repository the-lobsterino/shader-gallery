#ifdef GL_ES
precision mediump float;
#endif
//  For fun not profit...   
// Note2self : Still need some work  (Like zoom and logos.....and stuff! )
// Code from : http://glslsandbox.com/e#59382.0

uniform float time;uniform vec2 mouse,resolution;varying vec2 surfacePosition;
#define PI 3.1416
const vec3 y=vec3(0.,.15,.4),v=vec3(.6,.7,.55),x=vec3(.2,.7,.3),f=vec3(.8,.9,.9),r=vec3(.4,.35,.2);
vec2 t(vec2 v){vec2 n;n.x=fract(sin(dot(v.xy,vec2(12.9898,78.233)))*43758.5)*2.-1.;n.y=fract(sin(dot(v.xy,vec2(34.9865,65.946)))
											     *28618.4)*2.-1.;return normalize(n);
	      }float n(vec2 v){vec2 n=floor(v),d=fract(v);float y=dot(t(n),v-n),g=dot(t(vec2(n.x+1.,n.y)),v-vec2(n.x+1.,n.y)),
	x=dot(t(vec2(n.x,n.y+1.)),v-vec2(n.x,n.y+1.)),f=dot(t(vec2(n.x+1.,n.y+1.)),v-vec2(n.x+1.,n.y+1.)),r=3.*(d.x*d.x)-2.*(d.x*d.x*d.x),
	i=y+r*(g-y),s=x+r*(f-x),e=3.*(d.y*d.y)-2.*(d.y*d.y*d.y);return i+e*(s-i);}vec3 n(vec2 d,float i,float t){float g=n(d*1.5)*70.+n(d*7.)
	*20.+n(d*20.)*10.+n(d*60.)*7.,s=-i*.3+.5;if(g>30.-abs(d.y)*20.)return f*vec3(s*1.15,s+.1,s+.1)+
		vec3(gl_FragCoord.xy/resolution.xy,1.)*pow(t,10.);else if(g>3.)return x*(g*.007+.7)*vec3(s*3.-.9,s*.8+.2,s*.8+.2)+
			r*max(0.,i)*max(0.,n(d*80.))*.9*max(0.,-g*.3+4.)+vec3(gl_FragCoord.xy/resolution.xy,1.)*pow(t,10.);
			else if(g>1.)return v*s+vec3(gl_FragCoord.xy/resolution.xy,1.)*pow(t,10.);else return y*vec3(s,s*2.1-.2,s*.8+.2)+
				vec3(gl_FragCoord.xy/resolution.xy,1.)*pow(t,5.);}void main(){vec2 v=-1.+2.*
	(gl_FragCoord.xy/resolution.xy);v.x*=resolution.x/resolution.y;v=surfacePosition*2.;float s=dot(v,v);const float y=.8;
  vec2 x=vec2(.65,.2);vec3 t=vec3(.05,.1,.2)/s+	vec3(1.,.8,.3)*smoothstep(0.,7.,1./distance(v,x))*2.;if(s<y*y){vec2 d=v/y;float f=asin(d.x),r=sqrt(1.-d.y*d.y),g=f/r;
						vec2 i=vec2(g-time*.001,v.y/y/r);t=n(i,-g*1.1,s/(y*y));}gl_FragColor=vec4(t,1.);}