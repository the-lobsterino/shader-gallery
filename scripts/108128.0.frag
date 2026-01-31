#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const vec4 firstColor = vec4(0,0,1,1);
const vec4 secondColor = vec4(1,1,0,1);
//const float r0 = 200.0, r1 = 0.0;
//const float r0 = 100.0, r1 = 50.0;
const float r0 = 50.0, r1 = 100.0;
//const float r0 = 0.0, r1 = 94.0;

void main( void ) {
	//highp float x0 = 600.0, y0 = 250.0, x1 = 300.0, y1 = 300.0;
	highp float x0 = 500.0, y0 = 300.0, x1 = 400.0, y1 = 300.0;
	//highp float x0 = 95.0, y0 = 217.0, x1 = 95.0, y1 = 217.0;
	
	highp float xP = gl_FragCoord.x;
	highp float yP = gl_FragCoord.y;
	
	
	highp float x0Minusx1 = x0 - x1;
	highp float y0Minusy1 = y0 - y1;
	highp float r0Sq = r0 * r0;
	highp float r0Mulr1 = r0 * r1;
	highp float r1Sq = r1 * r1;
	highp float x1Muly0 = x1 * y0;
	highp float x0Muly1 = x0 * y1;
	highp float minusr1Mulr0Subr1 = -r1 * (r0 - r1);
	highp float divisor = ((r0 - r1) * (r0 - r1) - x0Minusx1 * x0Minusx1 - y0Minusy1 * y0Minusy1);
	
	highp float distanceBetweenCenters = sqrt(pow(x1 - x0, 2.0) + pow(y1 - y0, 2.0));
	bool isContained = (distanceBetweenCenters + r0) <= r1;
        	
	highp float x0MinusxP = x0 - xP;
	highp float x0MinusxPSq = x0MinusxP * x0MinusxP;
	highp float y0MinusyP = y0 - yP;
	highp float y0MinusyPSq = y0MinusyP * y0MinusyP;
	highp float x1MinusxP = x1 - xP;
	highp float x1MinusxPSq = x1MinusxP * x1MinusxP;
	highp float y1MinusyP = y1 - yP;
	highp float y1MinusyPSq = y1MinusyP * y1MinusyP;

	highp float sub1 = x1Muly0 - xP * y0 - x0Muly1 + xP * y1 + x0 * yP - x1 * yP;
		
	highp float dividend1Sq =
		-2.0 * r0Mulr1 * (x0MinusxP * x1MinusxP + y0MinusyP * y1MinusyP)
		+ r1Sq * (x0MinusxPSq + y0MinusyPSq)
		+ r0Sq * (x1MinusxPSq + y1MinusyPSq)
		- sub1 * sub1;
	
	if (dividend1Sq < 0.0)
                return;
	
	highp float dividend0 = minusr1Mulr0Subr1 + x0Minusx1 * x1MinusxP + y0Minusy1 * y1MinusyP;
	highp float dividend1 = sqrt(dividend1Sq);
	

	if (distance(gl_FragCoord.xy, vec2(x1, y1)) <= r1)
                dividend1 = -dividend1;
	
	highp float t = 1.0 - (dividend0 + dividend1) / divisor;
	if(t < 0.0 && isContained) {
		t = 1.0 - t;
	}
	
	if(r1>r0)
	{
		if(t < -1.0)
		{
			return;		
		}
		
	}else if(r0>r1)
	{
		if(t > 1.0)
		{
			return;
		}
	}
	//if (t < 1.0)
	{
		gl_FragColor = mix(firstColor, secondColor, t);
	}
}