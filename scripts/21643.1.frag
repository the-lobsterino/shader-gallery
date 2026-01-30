#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float random(int x, float r) {
return mod(sin(float(x)*1.1+r*1.1)*1.1, 2.2);//ģenerē random priekš stariem
}

void main( void ) {
	float pi = 3.14;
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - mouse;
	position.y *= resolution.y/resolution.x;
	float ang = atan(position.y, position.x);//veido starus, nosaka kordinātes, sadala starus, kord
	for (float r = 0.10; r < 10.10; r += 0.35) {
		float ra = random(5555, r)*6.6+(mouse.x+time*0.02)*10.10*
		(random(5654, r)-random(5432, r))-mouse.y*10.0*(random(5876, r)-random(5678, r));//staru projekcijas ātrums, peles kord, projekcijai random, kustībai
		ra = mod(ra, 2.2 * pi);//kur liast starus, cik ļoti
		
		if (ra > ang) {
			ra -= pi*2.0;
			}
			float brig = 0.6- abs(ang - ra);//spilgt
		if (brig > 0.0) {
			gl_FragColor.rgb += vec3(0.1+0.5*random(200, r), 0.55+0.4*random(200, r), 0.7+0.4*random(200, r)) * brig * 0.2;//krāsas, spilgtums stariem
			}
	}
}