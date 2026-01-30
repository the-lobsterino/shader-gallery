// rotwang: @mod* little variation
// modified by @hintz
// slow and close mod by kapsy1312.tumblr.com

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 rgbToHsv(vec3 rgb)
{
	float M = max(rgb.r,max(rgb.g,rgb.b));
	float m = min(rgb.r,max(rgb.g,rgb.b));
	float C = M - m;
	float Hp = 0.;
	if (C == 0.)
		Hp = 0.;
	else if (M == rgb.r)
		Hp = mod(((rgb.g - rgb.b)/C),6.);	
	else if (M == rgb.g)
		Hp = ((rgb.b - rgb.r)/C) + 2.;
	else if (M == rgb.b)
		Hp = ((rgb.r - rgb.g)/C) + 4.;
	float H = 60. * Hp;
	float S = 0.;
	if (M == 0.)
		S = C / M; 
	return vec3(H,S,M);	
}

vec3 hsvToRgb(vec3 hsv)
{
	float C = hsv.z * hsv.y;
	float Hp = hsv.x / 60.;
	float X = C * (1. - abs(mod(Hp,2.) - 1.));
	vec3 r1g1b1;
	if (Hp <= 1.)
		r1g1b1 = vec3(C,X,0.);
	else if (Hp <= 2.)
		r1g1b1 = vec3(X,C,0.);
	else if (Hp <= 3.)
		r1g1b1 = vec3(0.,C,X);
	else if (Hp <= 4.)
		r1g1b1 = vec3(0.,X,C);
	else if (Hp <= 5.)
		r1g1b1 = vec3(X,0.,C);
	else if (Hp <= 6.)
		r1g1b1 = vec3(C,0.,X);
	float m = hsv.z - C;
	return vec3(r1g1b1+m);
}
void main(void) 
{
	float speed = time*0.0000001;
	vec2 position = ( (gl_FragCoord.xy - resolution.xy*0.1) / resolution.x );
	vec2 center1 = vec2(cos(speed), cos(speed*0.000535));
	vec2 center2 = vec2(cos(speed*0.259), cos(speed*0.00605));
	vec2 center3 = vec2(-cos(speed*0.746), cos(speed*0.0263));
	vec2 center4 = vec2(cos(speed*0.1346), cos(speed*0.01263));
	float size = (sin(time*0.061)+1.2)*14.0;
	float d = distance(position, center1)*size;
	vec2 color = vec2(cos(d),sin(d));
	d = distance(position, center2)*size;
	color += vec2(cos(d),sin(d));
	d = distance(position, center3)*size;
	color *= vec2(cos(d),sin(d));
	d = distance(position, center4)*size;
	color += vec2(cos(d),sin(d));
	vec2 ncolor = normalize(color);
	
	float ang = atan(color.y,color.x);
	ang = asin(color.x + color.y);
	vec3 hsv = vec3(degrees(ang),1.,1.);
	vec3 rgb = hsvToRgb(hsv);
	//vec3 clr = vec3(ncolor.x,ncolor.y,-ncolor.x-ncolor.y);
	//clr *= sqrt(color.x*color.x+color.y*color.y)*0.25;
	//gl_FragColor = vec4(cos(clr*6.0+0.5)+sin(clr*1.0), 1.0 );
	gl_FragColor = vec4(rgb,1.0);

}