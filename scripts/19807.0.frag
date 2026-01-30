#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float t = time * .5;

vec3 varyColor(vec3 col, float var, vec2 p) {
	float varTime = 3. * t;
	return col - var / 2. + var * vec3(sin(varTime + p.y), sin(varTime * mod(p.x, .3) * 1.) * .4, sin(varTime - p.y) * .3);
}

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2. - 1.;
	float aspect = resolution.x / resolution.y;
	uv.x *= aspect;

	float d = sqrt(uv.x * uv.x + uv.y * uv.y);
	float a = atan(uv.x, uv.y);

	float offsetAngle = 2. * PI * smoothstep(0., 1.,
                clamp(mod(t, 2. * PI), 0., PI) / PI);
	uv = vec2(uv.x + .3 * cos(offsetAngle), uv.y + .3 * sin(offsetAngle));

	vec3 bgCol = vec3(.7);
	float colVariance = .12;
	vec3 hilightCol = vec3(235.,233.,224.)/255.;
	
	vec3 col = bgCol;
	
	float rad = .15 + .05 * (sin(t) * .5 + .5);
	float gap = 2. * rad + .01 + .1 * clamp((sin(t) * .5 + .5), 0., .5);

	for (float i = 0.; i < 15.; i++) {
		for (float j = 0.; j < 11.; j++) {

			vec2 pos = vec2(i * gap - (7. * gap),
					j * gap * .867 - (5. * gap));

			float hilightPosX = rad / 2. - gap / 4. + .01;
			float hilightCurvePhase = mod(uv.y + .76 * gap * .867, 2. * gap * .867) / (2. * gap * .867);
			// sine curve
			hilightPosX -= .07 * clamp((1. - abs(uv.x)), -.06, 1.) * sin(1.58 + 2. * PI * hilightCurvePhase);
			// pass over screen
			hilightPosX += mod(t * 3., 8.) - 3.;
			if (mod(j, 2.) < .5) {
				pos.x += gap / 2.;
				hilightPosX += gap / 2.;
			}
			float hilightIntensity = clamp(.3 * (1.7 - 5. * abs(uv.x - hilightPosX)), 0., 1.);
			
			float dist = sqrt( (uv.x - pos.x) * (uv.x - pos.x) +
                                (uv.y - pos.y) * (uv.y - pos.y) );
			if (dist < rad) {
				col = varyColor(vec3(sin(i+t)*.4+.7, sin(j+t)*.4+.6, sin((i+j)*t*.3)*.4+.6),
						colVariance, vec2(i, j));
				col = mix(col, hilightCol, hilightIntensity);
			}
		}
	}

	gl_FragColor = vec4( col, 1.0 );

}