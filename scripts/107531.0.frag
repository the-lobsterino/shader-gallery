
precision highp float;


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bb;
float runnerHeight;
float runCycle;

vec2 Segment( vec2 a, vec2 b, vec2 p )
{
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp(dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	return vec2(length( pa - ba*h ), h );
}

float Head( vec2 p, float s )
{
	p *= vec2(1.4, 1.1);
	return length(p)-s;
}

vec2 Rotate(vec2 pos, vec2 piv, float ang)
{
	mat2 m = mat2(cos(ang), sin(ang), -sin(ang), cos(ang));
	pos = (m * (pos-piv))+piv;
	return pos;
}

float Smin( float a, float b )
{
	float k = 0.025;
	float h = clamp( 0.5 + 0.5*(b-a)/k, 0.0, 1.0 );
	return mix( b, a, h ) - k*h*(1.0-h);
}

vec2 Running( vec2 p)
{
	float material = 0.0;
	float d;
	float ang = -.4;
	mat2 leanM = mat2(cos(ang), sin(ang), -sin(ang), cos(ang));
	runnerHeight = -.5 + .05*min(.7, cos(runCycle*2.0+.5));
	p += vec2(0.0, runnerHeight);
	p *= leanM;
	float headX = sin(runCycle*.55)*.035;
	d = Head(p-vec2(.44+headX, -0.02-headX*.5), .08);
	float arm1 = sin(runCycle)*.6*(.2+1.0);
	float leg1 = sin(runCycle)*.7*(.05+.5);
	vec2 h = Segment( vec2(0.4,-0.1-0.01-headX*.5), vec2(0.42+headX,-.04), p );
	float d2 = h.x - 0.03 + h.y*0.005;
	d = Smin(d, d2 );
	h = Segment( vec2(0.4,-0.17), vec2(0.4,-.37), p );
	d2 = h.x - 0.065 + h.y*0.03;
	d = Smin(d, d2 );
	vec2 elbow = Rotate(vec2(0.4,-.3), vec2(.4,-0.14), arm1);
	h = Segment(vec2(0.4,-0.14),  elbow, p );
	d2 = h.x - 0.04 + h.y*0.01;
	d = min(d, d2 );
	float tt = time;
	vec2 penis = vec2((sin(tt) * 0.50 + 0.5) * 0.06 + 0.56,(sin(tt) * 0.5 + 0.5) * 0.3 - 0.5);
	h = Segment(vec2(0.4,-0.4),  penis, p );
	d2 = h.x - ((sin(tt) * 0.5 + 0.5) * 0.01 + 0.02) + h.y*0.01;
	d = min(d, d2 );
	vec2 wrist = Rotate(elbow+vec2(.13, -.02), elbow, arm1*1.5-.3);
	h = Segment(elbow,  wrist, p );
	d2 = h.x - 0.03 + h.y*0.01;
	d = min(d, d2 );
	vec2 hand = Rotate(wrist+vec2(.005, -0.0), wrist, arm1*1.5-.3);
	h = Segment(wrist,  hand, p );
	d2 = h.x - 0.03 + h.y*0.001;
	d = min(d, d2 );
	vec2 knee = Rotate(vec2(0.4,-.55), vec2(.4,-0.35), -leg1+.5);
	h = Segment(vec2(0.4,-.35), knee, p );
	d2 = h.x - 0.05 + h.y*0.015;
	d = Smin(d, d2 );
	vec2 rotFoot = Rotate(knee+vec2(.0, -.22), knee, -(-leg1*.3+1.6));
	rotFoot = Rotate(rotFoot, knee, smoothstep(-.2, .2, -(leg1)*.15)*5.2-1.2);
	h = Segment(knee, rotFoot , p );
	d2 = h.x - 0.03+ h.y*0.008;
	d = Smin(d, d2 );
	vec2 toes = Rotate(rotFoot+vec2(.09, 0.0), rotFoot, smoothstep(-.1, .15, -leg1*.2)*2.4-1.7-leg1);
	h = Segment(rotFoot, toes, p );
	d2 = h.x - 0.018 + h.y*0.005;
	d = Smin(d, d2 );
	if (d > 0.005)
	{
		elbow = Rotate(vec2(0.4,-.3), vec2(.4,-0.14), -arm1);
		h = Segment(vec2(0.4,-0.14), elbow, p );
		d2 = h.x - 0.04 + h.y*0.01;
		d = min(d, d2 );
		wrist = Rotate(elbow+vec2(.13, -.01), elbow, -arm1*1.5+.1);
		h = Segment(elbow,  wrist, p );
		d2 = h.x - 0.03 + h.y*0.01;
		d = min(d, d2 );
		vec2 hand = Rotate(wrist+vec2(.005, -0.0), wrist, -arm1*1.5-.3);
		h = Segment(wrist,  hand, p );
		d2 = h.x - 0.03 + h.y*0.001;
		d = min(d, d2 );
		knee = Rotate(vec2(0.4,-.55), vec2(.4,-0.35), leg1+.5);
		h = Segment(vec2(0.4,-.35), knee, p );
		d2 = h.x - 0.05 + h.y*0.02;
		d = min(d, d2 );
		rotFoot = Rotate(knee+vec2(.0, -.22), knee, -(leg1*.3+1.6));
		rotFoot = Rotate(rotFoot, knee, smoothstep(-.2, .2, leg1*.15)*5.2-1.2);
		h = Segment(knee, rotFoot, p );
		d2 = h.x - 0.03+ h.y*0.008;
		d = Smin(d, d2 );
		toes = Rotate(rotFoot+vec2(.09, 0.0), rotFoot, smoothstep(-.1, .15, leg1*.2)*2.4-1.7+leg1);
		h = Segment(rotFoot, toes, p );
		d2 = h.x - 0.018 + h.y*0.005;
		d = Smin(d, d2 );
		material = 2.0;
	}
	return vec2(d, material);
}

void main() 
{
	vec2 p = (-resolution.xy + 2.0 * gl_FragCoord.xy) / min(resolution.x, resolution.y);
	vec2 m = (mouse * 2.0 - 1.0) * vec2(resolution.x / resolution.y, 1.0);
	vec3 col;
	runCycle = time*4.0;
	vec2 res = Running(p * .5);
	col=vec3(smoothstep(0.0, .0055, res.x));
	gl_FragColor = vec4(1.0-col, 1.0);
}
