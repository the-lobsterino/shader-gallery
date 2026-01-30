precision lowp float;

uniform float time;
uniform vec2 resolution;

void main()
{
    float t = time;
    vec3 ro = vec3(.0, .0, -9.);
    vec3 rd = normalize(vec3((gl_FragCoord.xy * 2. - resolution.xy) / min(resolution.x, resolution.y), 1.));

    // ---- rotation 

    // ---- positions 
    vec3 a = vec3(0.001, 0.001, 3.5), b = vec3(1.5);

    // ---- cube length (max(abs(x) - y, 1.) )
	for (int i = 0; i < 20; i++) {
		t += 0.1;
    	float  s = sin(t), c = cos(t);
    	mat3 r = mat3(1., 0, 0,
                  0, c, -s,
                  0, s, c) * 
             mat3(c, 0, s,
                  0, 1, 0,
		 -s, 0, c);
    	ro += min(length(abs((ro + a) * r) - b*r) - 1.0, 0.5) * rd;
	}
    // ---- shading
    gl_FragColor.rgb = (vec3(0.1, 0.35, 0.72) * -ro.z * 0.3);
	gl_FragColor.a = 1.0;
	
	
}