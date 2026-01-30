#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//C# Glenn Slayden
//translated to GLSL language
float tri(vec2 p, vec2 p0, vec2 p1, vec2 p2) {
    float s = p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y;
    float t = p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y;

    //if ((s < 0.) != (t < 0.)) {
    //return 0.;
    //}

    float A = -p1.y * p2.x + p0.y * (p2.x - p1.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y;
    if (A < 0.0)
    {
        s = -s;
        t = -t;
        A = -A;
    }
	
    //Does anybody know how to make a anti-aliased version of this?
    return float(s > 0. && t > 0. && (s + t) < A);
}
void main( void ) {
	// Judging by where you put your comment above, I am not sure if this is what you were looking for.
	// But here it is anyways. If this is not the kind of AA you were looking for, I hope maybe this
	// will help you get there.
	// Regards,
	// MG
	
	float triangle = 0.0;

	for (int i = 0; i < 16; i++) {
		vec2 q = vec2(floor(mod(float(i), 4.0)) / 4.0, floor(float(i)) / 16.0);
		
		vec2 uv = ( (gl_FragCoord.xy + q) / resolution.xy );
		vec2 p0 = vec2(0.,0.);
		vec2 p1 = vec2(mouse.x,mouse.y);
		vec2 p2 = vec2(0.5,1.);
		triangle += tri(uv,p0,p1,p2);
		
	}
	
	gl_FragColor = vec4( vec3(triangle / 16.0), 1.0 );
}