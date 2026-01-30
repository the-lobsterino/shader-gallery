#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float Nx = 4. + floor(mouse.x*100.);
	float Ny = floor(Nx*resolution.y/resolution.x);
	float bucketx = floor(position.x*Nx)/Nx;
	float buckety = floor(position.y*Ny)/Ny;
	
	float r = random(vec2(bucketx, buckety));
	
	float qx = (position.x-bucketx)*Nx;
	float qy = (position.y-buckety)*Ny;

	gl_FragColor = vec4(qx, qy, 0.0, 2.0);
}