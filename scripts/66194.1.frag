#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) 
{
    vec2 p = (gl_FragCoord.xy / resolution.xy) - vec2(-0.5, 0.5);
	
    float sx = 1.0 * -p.x;
	
    float dy = sx / 2.0;
	
    float pulse = (1.0 + cos(time) * 0.25);
	
    dy += 35.0 / (150.0 * pulse * length(p / vec2(1.0 / cos(0.0), 1.0) - vec2(p.x, 0.0)));
	
    vec3 colour = vec3(p.x * dy * 0.25 * pulse, 0.255 * dy, p.x * dy);
	
    float alpha = ((colour.r + colour.g + colour.b) / 3.0);
	
    gl_FragColor = vec4(colour, alpha/alpha) ;
}