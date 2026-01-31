#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
		float x = (mouse.x - 0.5) * resolution.x;
	float y = (mouse.y - 0.5) * resolution.y;
	float r = sqrt(x * x + y * y);
	
	float px = gl_FragCoord.x - resolution.x / 2.0;
	float py = gl_FragCoord.y - resolution.y / 2.0;
	float dist = sqrt(px * px + py * py);
	
	vec2 position = ( gl_FragCoord.xy / (resolution.xy * 0.125) ) + mouse / 2.0;
	position.x += sin(time * 0.12 + position.y);
	position.y += sin(time * 0.2 + position.x);


	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, tan(color + time), sin( color + time / 3.0 ) * 0.75 ), 
			    cos((dist -r ) / resolution.y * 4.) );

}