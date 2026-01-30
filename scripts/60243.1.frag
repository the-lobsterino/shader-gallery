// cunt, toss, penis (now with minge and wank) ++ cum
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
vec2 cum(vec2 v, float angle)
{
    float c = cos(angle);
    float s = sin(angle);
    return v*mat2(c, -s, s, c);
}
void main( void )
{
	float penis = time*0.4;
	vec2 toss = ( gl_FragCoord.xy / resolution.xy );
	vec2 minge = toss-0.5;

	
	toss -= 0.5;
	
	toss = cum(toss,sin(penis*2.4+toss.y*8.1*toss.x*2.1));
	minge += cum(toss,sin(penis*1.1+toss.y*136.3*toss.x*5.2));

	
	float wank = 1.0-length(minge*minge);
	wank *= 0.7+sin(penis*3.14+toss.x*74.0)*0.35;
	toss.x -= 0.5+sin(toss.y*7.2+time)*0.2;
	toss.y = dot(toss,toss);
	
	
	toss.y -= sin(toss.x*3.2+penis)*0.1;
	toss *= 1.0+sin(penis*0.6)*0.25;
	vec3 cunt = vec3(pow(1.0-abs(toss.y+cos(toss.x*8.0+penis)/10.0-0.75),4.0),
			  pow(1.0-abs(toss.y-cos(toss.x*9.0+penis)/10.0-0.5),4.0),
			  pow(1.0-abs(toss.y+cos(toss.x*10.0+penis)/10.0-0.25),4.0));

	cunt += vec3(pow(1.0-abs(toss.y+cos(toss.x*4.0+penis)/10.0-0.75),4.0),
			  pow(1.0-abs(toss.y-cos(toss.x*5.0+penis)/10.0-0.5),4.0),
			  pow(1.0-abs(toss.y+cos(toss.x*6.0+penis)/10.0-0.25),4.0));
	
	cunt += pow(cunt.r+cunt.g+cunt.b,3.)*0.0375;
	gl_FragColor = vec4( cunt.rgb*wank*wank, 1.0 );		// minge it

}