#extension GL_OES_standard_derivatives : disable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool inCapsule(vec2 a, vec2 b, float r, vec2 p) {
	float rSqr = r*r;
	vec2 ap = p - a;
	vec2 bp = p - b;
	float apSqr = dot(ap, ap);
	if (apSqr < rSqr || dot(bp, bp) < rSqr) return true;
	vec2 ab = b - a;
	float aqSqr = dot(ap, ab);
	float abSqr = dot(ab, ab);
	if (aqSqr < 0.0 || aqSqr > abSqr) return false;
	float pqSqr = apSqr - aqSqr * aqSqr / abSqr;
	return pqSqr < rSqr;
}

void main( void ) {

	vec2 A = vec2(-0.7, 0.0);
	vec2 B = vec2(0.7, 0.0);
	float capsRadius = 0.6;
	
	vec2 pix01 = ( gl_FragCoord.xy / resolution.xy );
	vec2 pixm11 = pix01 * 2.0 - 1.0;
	float aspectRatio = resolution.x / resolution.y;
	pixm11.x *= aspectRatio;
	
	float col;
	
	if (!true) {
		float ab = length(B - A);
		float hab = ab * 0.5;
		float maxDistance = sqrt(capsRadius*capsRadius + hab*hab) * 2.0;
		
		float da = length(pixm11 - A);
		float db = length(pixm11 - B);
		
		col = float(da < capsRadius || db < capsRadius || da+db < maxDistance);
	} else {
		col = float(inCapsule(A, B, capsRadius, pixm11));
	}
	
	gl_FragColor = vec4(vec3(col), 1.0);
}