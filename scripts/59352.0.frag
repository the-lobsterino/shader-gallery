// LABOUR
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const bool glow = true;

const vec4 BULBC = vec4( 0.8, 0.8, 0.0, 1.0 );
const vec4 BASEC = vec4( 0.6, 0.6, 0.6, 1.0 );
const vec4 GLOWC = vec4( 0.9, 0.9, 0.9, 1.0 )*1.5;

float sstep(float edge, float value) {
	float SMOOTH=0.003;
	return smoothstep(edge - SMOOTH, edge + SMOOTH, value);
}

float bulbSelector(vec2 position, float bellRadius) {
	// Bell
	float bulbC = 1.0 - sstep(bellRadius, distance(position, vec2(0.0, 0.11)));

	// Curved edges
	float lside = sstep(atan(-5.9 * position.y * 3.1415 * 0.5) * 0.2, 0.35 + position.x);
	float rside = sstep(atan(-2.9 * position.y * 2.1415 * 0.5) * 0.2, 0.35 - position.x);
	float curveVert = 1.0 - max(step(0.0, position.y), 1.0 - sstep(-0.401, position.y));
	float curveC = min(min(rside, lside), curveVert);
	
	return max(bulbC, curveC);
}

float baseSelector(vec2 position) {
	// Base
	float baseVert = max(step(-0.4, position.y), 1.0 - step(-0.92, position.y));
	float baseHoriz = sstep(0.05 + (0.03 * pow(abs(sin((310.0 + position.y-time*0.05) * 46.6)), 1.8)), abs(position.x)*0.6);
	return 1.0 - max(baseHoriz, baseVert);
}

#define CHS 0.18
float sdBox2(in vec2 p,in vec2 b) {vec2 d=abs(p)-b;return length(max(d,vec2(0))) + min(max(d.x,d.y),0.0);}
float line2(float d,vec2 p,vec4 l){vec2 pa=p-l.xy;vec2 ba=l.zw-l.xy;float h=clamp(dot(pa,ba)/dot(ba,ba),0.0,1.0);return min(d,length(pa-ba*h));}
float LR(vec2 p, float d){p.x=abs(p.x);return line2(d,p,vec4(2,-3.25,2,3.25)*CHS);}
float TB(vec2 p, float d){p.y=abs(p.y);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float TBLR(vec2 p, float d){return min(d,abs(sdBox2(p,vec2(2,3.25)*CHS)));}
float A(vec2 p,float d){d=LR(p,d);p.y=abs(p.y-1.5*CHS);return line2(d,p,vec4(2,1.75,-2,1.75)*CHS);}
float B(vec2 p,float d){p.y+=1.75*CHS;d=min(d,abs(sdBox2(p,vec2(2.0,1.5)*CHS)));p+=vec2(0.5,-3.25)*CHS;return min(d,abs(sdBox2(p,vec2(1.5,1.75)*CHS)));}
float C(vec2 p,float d){d=TB(p,d);return line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);}
float D(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(2,-1,2,1)*CHS);p.y=abs(p.y);d=line2(d,p,vec4(2,1,1.5,2.75)*CHS);d=line2(d,p,vec4(1.5,2.75,1,3.25)*CHS);return line2(d,p,vec4(1,3.25,-2,3.25)*CHS);} // SUCK MY ARSEHOLE
float E(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float F(vec2 p,float d){d=line2(d,p,vec4(2,3.25,-2,3.25)*CHS);d=line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);return line2(d,p,vec4(0,-0.25,-2,-0.25)*CHS);}
float G(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(2,2.25,2,3.25)*CHS);d=line2(d,p,vec4(2,-3.25,2,-0.25)*CHS);return line2(d,p,vec4(2,-0.25,0.5,-0.25)*CHS);}
float H(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(-2,-0.25,2,-0.25)*CHS);}
float I(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);p.y=abs(p.y);return line2(d,p,vec4(1.5,3.25,-1.5,3.25)*CHS);}
float J(vec2 p,float d){d=line2(d,p,vec4(-1.5,-3.25,0,-3.25)*CHS);d=line2(d,p,vec4(0,-3.25,1,-2.25)*CHS);d=line2(d,p,vec4(1,-2.25,1,3.25)*CHS);return line2(d,p,vec4(1,3.25,-1.5,3.25)*CHS);}
float K(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,3.25)*CHS);d=line2(d,p,vec4(-2,-0.25,-0.5,-0.25)*CHS);d=line2(d,p,vec4(2,3.25,-0.5,-0.25)*CHS);return line2(d,p,vec4(-0.5,-0.25,2,-3.25)*CHS);}
float L(vec2 p,float d){d=line2(d,p,vec4(2,-3.25,-2,-3.25)*CHS);return line2(d,p,vec4(-2,3.25,-2,-3.25)*CHS);}
float M(vec2 p,float d){p.x=abs(p.x);d=line2(d,p,vec4(2,-3.25,2,3.25)*CHS);return line2(d,p,vec4(0,0.75,2,3.25)*CHS);}
float N(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);}
float O(vec2 p,float d){return TBLR(p,d);}
float P(vec2 p,float d){d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d,abs(sdBox2(p,vec2(2.0,1.75)*CHS)));}
float Q(vec2 p,float d){d=TBLR(p,d);return line2(d,p,vec4(2,-3.25,0.5,-1.75)*CHS);}
float R(vec2 p,float d){d=line2(d,p,vec4(0.5,-0.25,2,-3.25)*CHS);d=line2(d,p,vec4(-2,-3.25,-2,0.0)*CHS);p.y-=1.5*CHS;return min(d, abs(sdBox2(p,vec2(2.0,1.75)*CHS)));}
float S(vec2 p,float d){d=TB(p,d);d=line2(d,p,vec4(-2,3.25,-2,-0.25)*CHS);d=line2(d,p,vec4(-2,-0.25,2,-0.25)*CHS);return line2(d,p,vec4(2,-0.25,2,-3.25)*CHS);}
float T(vec2 p,float d){d=line2(d,p,vec4(0,-3.25,0,3.25)*CHS);return line2(d,p,vec4(2,3.25,-2,3.25)*CHS);}
float U(vec2 p,float d){d=LR(p,d);return line2(d,p,vec4(2,-3.25,-2,-3.25)*CHS);}
float V(vec2 p,float d){p.x=abs(p.x);return line2(d,p,vec4(0,-3.25,2,3.25)*CHS);}
float W(vec2 p,float d){p.x=abs(p.x);d=line2(d,p,vec4(2,-3.25,2,3.25)*CHS);return line2(d,p,vec4(0,-1.25,2,-3.25)*CHS);}
float X(vec2 p,float d){d = line2(d,p,vec4(-2,3.25,2,-3.25)*CHS);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}
float Y(vec2 p,float d){d=line2(d,p,vec4(0,-0.25,0,-3.25)*CHS);p.x=abs(p.x);return line2(d,p,vec4(0,-0.25,2,3.25)*CHS);}
float Z(vec2 p,float d){d=TB(p,d);return line2(d,p,vec4(-2,-3.25,2,3.25)*CHS);}

float pMod1(inout float p, float size)
{
	float halfsize = size*0.5;
	float c = floor((p + halfsize)/size);
	p = mod(p + halfsize, size) - halfsize;
	return c;
}

float GetText(vec2 uv)
{
	uv.x += 5.35;
	uv.y -= 1.0;
	
	uv.y -= time*3.15;
	float c = pMod1(uv.y,2.0);
	uv.x += sin(time*0.5+c*0.85)*1.25;
	//uv.y = mod(uv.y,2.0)-1.0;
	
	float d = V(uv,1.0);uv.x -= 1.1;
	d = O(uv,d);uv.x -= 1.1;
	d = T(uv,d);uv.x -= 1.1;
	d = E(uv,d);uv.x -= 2.1;
	d = L(uv,d);uv.x -= 1.1;
	d = A(uv,d);uv.x -= 1.1;
	d = B(uv,d);uv.x -= 1.1;
	d = O(uv,d);uv.x -= 1.1;
	d = U(uv,d);uv.x -= 1.1;
	d = R(uv,d);uv.x -= 1.1;
	d-=sin(uv.x*uv.y*0.9+time*0.25)*0.035;
	
	
	d = smoothstep(0.0,0.05,d-0.55*CHS);
	return d;
}


void main( void ) {
	vec2 halfRez = resolution.xy / 2.0;
	vec2 centeredPos = gl_FragCoord.xy - halfRez;
	vec2 position = centeredPos / (min(resolution.x, resolution.y) /2.0);
	// position is -1.0..+1.0 on smaller axis
	
	float bulbSel = bulbSelector(position, 0.41);
	float baseSel = baseSelector(position-vec2(0.04,0.0));

	baseSel = baseSel * (0.8 + 0.2 * sin(0.0 + (position.y * 2.0 * 46.6)));
	
	float glowSel = 0.9 - 0.8 * smoothstep(0.0, 1.0, pow(distance(position, vec2(0.0, 0.20)), 0.9));
	
	// darken the left edge slightly
	float cGrade = 0.6 + (0.4 * smoothstep(-0.3, 0.2, position.x));
	
	if (glow) {
	  cGrade = 1.0;
	} else {
	  glowSel = 1.6;
	}
	
	vec4 col = (glowSel * GLOWC)
		+ ((BULBC * bulbSel + BASEC * baseSel) * cGrade);
	
	float d= GetText(position*6.5);
	col = mix(col+vec4(.5,0.1,.8*position.y,1.0), col,d);
	
	
	gl_FragColor = col;
}