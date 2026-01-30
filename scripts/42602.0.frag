#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float f(vec2 pos){
	float r = sqrt(pow(pos.x,2.0)+pow(pos.y,2.0)); 
	float a = atan(pos.y,pos.x);

	return r-1.0+sin(3.0*a+2.0*pow(r,2.0)+time)*0.5;
}

float form( vec2 pos )
{
  float v = f( pos );
  return v;//smoothstep( 0.19, 0.20, abs(v) );
}

vec2 grad(vec2 pos){
	vec2 v = vec2(0.01,0.0);
	return vec2(f(pos+v.xy)-f(pos-v.xy),f(pos+v.yx)-f(pos-v.yx))/(2.0*v.x);
}

/*vec2 grad( in vec2 x )
{
    vec2 h = vec2( 0.01, 0.0 );
    return vec2( f(x+h.xy) - f(x-h.xy),
                 f(x+h.yx) - f(x-h.yx) )/(2.0*h.x);
}*/

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy )*2.0-1.0 ;
	pos*= 3.0;

	//float normal = 1.0/derive(pos);
	//float c = form(pos);//pos.x;
	vec2 _grad = grad(pos);//vec2(1.0,-1.0/derive(pos));
	
	float c = 1.0/length(_grad);
	gl_FragColor = vec4( smoothstep(0.19,0.21,c));

}