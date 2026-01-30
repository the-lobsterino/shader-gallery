precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 pos;
//uniform float step, colorSpeed, animSpeed;
uniform vec4 color;

void main( void ) {
	
	float colorSpeed = 1., animSpeed = 1., step =3.;
	float size = 6.;
	vec2 position = (gl_FragCoord.xy / resolution.xy*size)-vec2(pos.x, -pos.y);
	vec4 color = mix(vec4(1.0, 1.0, 0.0, 1.0), vec4(1.0, 0.0, 0.0, 1.0), sin(position.y*step+time*colorSpeed));
	gl_FragColor = vec4(color.r, color.g, color.b, 1.0);	
	
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 destColor = vec3(0.0);
    for(float i = 0.0; i < 5.0; i++){
        float j = i + 1.0;
        vec2 q = p + vec2(cos(time * j), sin(time * j)) * 0.5;
        destColor += 0.05 / length(q);
    }
    gl_FragColor += vec4(destColor, 1.0);
}
