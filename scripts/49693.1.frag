#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float distanceToLineSegment(vec2 p, vec2 a, vec2 b)
{
    vec2 pa = p - a, ba = b - a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
}

float lineWidth(float d, float w) {
//    return (1.0 - clamp( d, 0.0, w)*(1.0/w))*10.0;
      return smoothstep(1.0 - w,1.0,1.0 - d);
}

float plot_f(vec2 p, float y){
  return  smoothstep( y-0.002, y, p.y) -
          smoothstep( y, y+0.012, p.y);
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float c = 0.0;
	float d = 0.0;
	
	d = distanceToLineSegment(position, vec2(0.4,0.7), vec2(0.4,0.5));
	c += lineWidth(d, 0.005);
	d = distanceToLineSegment(position, vec2(0.4,0.5), vec2(0.47, 0.5));
	c += lineWidth(d, 0.005);
	
	d = distanceToLineSegment(position, vec2(0.5, 0.5), vec2(0.5, 0.7));
	c += lineWidth(d, 0.005);
	d = distanceToLineSegment(position, vec2(0.5, 0.7), vec2(0.57, 0.7));
	c += lineWidth(d, 0.005);
	d = distanceToLineSegment(position, vec2(0.57, 0.5), vec2(0.57, 0.7));
	c += lineWidth(d, 0.005);
	d = distanceToLineSegment(position, vec2(0.5, 0.5), vec2(0.57, 0.5));
	c += lineWidth(d, 0.005);
	
	d = distanceToLineSegment(position, vec2(0.6,0.7), vec2(0.6,0.5));
	c += lineWidth(d, 0.005);
	d = distanceToLineSegment(position, vec2(0.6,0.5), vec2(0.67, 0.5));
	c += lineWidth(d, 0.005);


	
	
	c += plot_f(position, sin(position.x*10.0));
	c += plot_f(position, sin(position.x*9.0));
	c += plot_f(position, sin(position.x*8.0));
	c += plot_f(position, sin(position.x*7.0));

	gl_FragColor = vec4( vec3(c), 1.0 );

}