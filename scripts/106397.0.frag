#version 300 es
precision highp float;

//in vec4 vColor;
in vec2 vLocation;

out vec4 fragColor;
uniform float seconds;

void main() {
    float fTemp = sin(vLocation.x * .5 *cos(.001 * seconds + .001 ) + .001);

    //fragColor = vec4(fTemp*.33, fTemp*.33,fTemp*.33,1.0);
    fragColor = vec4(0.6196, 0.0549, 0.0549, 1.0);


	vec2 position = gl_FragCoord.xy ;

	float color = 0.0;
	color += sin( position.x * cos( seconds / 15.0 ) * 80.0 ) + cos( position.y * cos( seconds / 15.0 ) * 10.0 );
	color += sin( position.y * sin( seconds / 10.0 ) * 40.0 ) + cos( position.x * sin( seconds / 25.0 ) * 40.0 );
	color += sin( position.x * sin( seconds / 5.0 ) * 10.0 ) + sin( position.y * sin( seconds / 35.0 ) * 80.0 );
	color *= sin( seconds / 10.0 ) * 0.5;

	fragColor = vec4( vec3( color, color * 0.5, sin( color + seconds / 3.0 ) * 0.75 ), 1.0 );
}