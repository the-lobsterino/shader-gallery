//by TommyX

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backBuffer;

float blurSize = 2.0/resolution.x;

// Default noise
float rand(vec2 co) {
    return (fract(sin(dot(co.xy + time*0.5,vec2(12.9898,78.233))) * 43758.5453)*2.0-1.0);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position = 0.5 + (position-0.5)*1.01;
	vec3 color = vec3(0.0);
	
	float a = rand(position);
	float b = rand(position + 0.2);
	
	color += texture2D(backBuffer, vec2(position.x+a*blurSize, position.y+b*blurSize)).rgb;
	
	/*
	color += texture2D(backBuffer, vec2(position.x, position.y+blurSize)).rgb;
	color += texture2D(backBuffer, vec2(position.x, position.y-blurSize)).rgb;
	color += texture2D(backBuffer, vec2(position.x, position.y)).rgb;
	color += texture2D(backBuffer, vec2(position.x+blurSize, position.y)).rgb;
	color += texture2D(backBuffer, vec2(position.x-blurSize, position.y)).rgb;
	color /= 5.0;
*/
	
	if (abs(position.x - mouse.x)*abs(position.x - mouse.x)*2.0+abs(position.y - mouse.y)*abs(position.y - mouse.y) < 0.005){
		color = vec3(0.2,0.7,0.9);
	}
	
	color -= 0.01;
		
	gl_FragColor = vec4( color, 1.0 );

}