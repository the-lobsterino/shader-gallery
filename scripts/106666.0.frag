#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) / 4.0;
	
	float sinValues = ((sin(position.x - time) + 1.0) - position.y * 8.0) + (1.5 * (sin(2.5 * position.x - 1.5 * time) + 1.0) - position.y * 8.0) + (0.6 * (sin(4.0 * position.x - 0.3 * time) + 1.0) - position.y * 8.0);
	sinValues = (sinValues) + .5;
	float sinValues2 = ((sin(0.2 * position.x - 1.2 * time) + 1.0) - position.y * 8.0) + (1.5 * (sin(1.2 * position.x - 0.6 * time) + 1.0) - position.y * 8.0) + (0.6 * (cos(2.1 * position.x - 1.3 * time) + 1.0) - position.y * 8.0);
	float sinValues3 = ((cos(0.4 * position.x - 0.85 * time) + 1.0) - position.y * 8.0) + (0.66 * (sin(1.2 * position.x - 1.23 * time) + 1.0) - position.y * 8.0) + (1.1 * (cos(2.1 * position.x - 0.7 * time) + 1.0) - position.y * 8.0);
	float sinValues4 = ((sin(1.1 * position.x - 2.3 * time) + 1.0) - position.y * 8.0) + (1.3 * (cos(1.2 * position.x - 0.7 * time) + 1.0) - position.y * 8.0) + (1.23 * (sin(2.1 * position.x - 2.0 * time) + 1.0) - position.y * 8.0);
	sinValues3 += .5;
	float color = 0.0;
	sinValues2 += .5;
	sinValues4 += .5;
	if (sinValues >= 0.0 && sinValues <= 0.1){
		color += 0.75;
	}
	if (sinValues2 >= 0.0 && sinValues2 <= 0.1){
		color -= 1.75;
	}
	if (sinValues3 >= 0.0 && sinValues3 <= 0.1){
		color += 0.75;
	}
	if (sinValues4 >= 0.0 && sinValues4 <= 0.1){
		color += 0.75;
	}
	if (sinValues == sinValues2){
		color += 1.0;
	}
	if (sinValues2 == sinValues3){
		color += 1.0;
	}
	if (sinValues3 == sinValues4){
		color += 1.0;
	}
	if (sinValues4 == sinValues2){
		color += 1.0;
	}
	if (sinValues4 == sinValues){
		color += 1.0;
	}
	if (sinValues3 == sinValues){
		color += 1.0;
	}
	if (position.y >= sinValues && position.y <= sinValues2){
		color += .5;
	}
	if (position.y >= sinValues3 && position.y <= sinValues4){
		color += .5;
	}
	if (position.y >= sinValues2 && position.y <= sinValues4){
		color -= .5;
	}

	    


	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color + time / 2.0 ) * 0.75 ), 1.0 );

}