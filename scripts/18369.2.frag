#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;


//change me
const vec3 targetColor = vec3(1.0,0.5,0.0);



void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	position = position * 200.0;
	vec4 imageColor = clamp(vec4( sin(position.x), cos(position.y), 1.0, 1.0 ), 0.0,0.5);
	
	
        float grayScale = dot(imageColor.rgb, vec3(0.299, 0.587, 0.114));
	
	
	gl_FragColor = vec4(vec3(grayScale, grayScale, grayScale) * targetColor, 1.0);
}