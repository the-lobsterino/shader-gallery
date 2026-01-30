#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;

mat3 rotateX(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        1.0, 0.0, 0.0,
        0.0, c, s,
        0.0, -s, c
    );
}


mat3 rotateY(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        c, 0.0, -s,
        0.0, 1.0, 0.0,
        s, 0.0, c
    );
}

void main( void ) {

	vec2 pointcoord = ( gl_FragCoord.xy / resolution.yy );
	
	// Get coordinates from -1 to 1.
	vec2 pos = vec2(
		(pointcoord.y * 2.0) - 1.0,
		-(pointcoord.x * 2.0 - 1.0)
	);
	
	// Default normal.
	vec3 normal = vec3(0.0, 0.0, 1.0);
	
	// Default angle is zero.
	vec2 angle = vec2(0.0);
	
	// If the pixel is inside the circle, set the angles to
	// be the maximum angle (90 degrees) multiplied by the
	// pos coordinate
	float mag = dot(pos.xy, pos.xy);
	if (mag <= 1.0) {
		angle = pos * 3.14159 / 2.0;			
	}
	
	// Rotate the vector on the x and y axes
	normal *= rotateX(angle.x);
	normal *= rotateY(angle.y);
	
	// get result in 0 to +1 space.
	normal += 1.0;
	normal /= 2.0;
	
	// Output the normal.
	gl_FragColor = vec4(normal, 1.0);
}