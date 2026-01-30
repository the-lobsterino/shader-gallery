// created by nardpw

precision highp float;

uniform float time;
uniform vec2 resolution;

void main(void) {
	vec2 position = (gl_FragCoord.xy / resolution.xy) + vec2(0.12, 0.2);
	
	//float a = position.x + position.y;
    	float progress = (position.x * (sin(time / 1.0) + 1.0) / 1.0 + position.y * (cos(time / 2.0) + 2.0) / 3.5) * 2.0 + (cos(time) * 4.0 + 1.0) / 4.0;

    	progress /= sqrt(position.x * position.y);

    	progress = sin(progress) + 1.0;
    	progress *= 1.2;

   	gl_FragColor = vec4(vec3(progress / 8.0, progress / 2.0, progress), 1.0);
}