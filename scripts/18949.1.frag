//+pk
#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

vec2 XYtoRTH(vec2 z){
	return vec2(length(z), atan(z.x, z.y));
}

vec2 RTHtoXY(vec2 z){
	return vec2(z.x*sin(z.y), z.x*cos(z.y));
}

vec2 powRTH(vec2 z, float N){
	// pow(r*exp(th), N) = pow(r, N)*exp(th*N)
	return vec2(pow(z.x, N), z.y*N);
}
void main( void ) {
	vec2 z = surfacePosition;//gl_FragCoord.xy/resolution.xy - 0.5;
	vec2 zE = XYtoRTH(z);//+vec2(0.1+0.05*sin(time+1./length(z)), 0.);
	zE.x *= 1.8;
	zE.y *= 0.5;
	//z = RTHtoXY(zE);
	
	float re = 0.;
	float gr = 0.;
	float bl = 0.;
	
	const float eaInt = -1.;
	const float eaLim = 1.;
	const float eaStp = 2.;
	float eaBailLim = eaLim;//(1.+cos(time*0.7))*eaLim/2.;
	
	for(float i0 = eaInt; i0 <= eaLim; i0+=eaStp)
	for(float i1 = eaInt; i1 <= eaLim; i1+=eaStp)
	for(float i2 = eaInt; i2 <= eaLim; i2+=eaStp)
	for(float i3 = eaInt; i3 <= eaLim; i3+=eaStp)
	for(float i4 = eaInt; i4 <= eaLim; i4+=eaStp)
	for(float i5 = eaInt; i5 <= eaLim; i5+=eaStp)
	for(float i6 = eaInt; i6 <= eaLim; i6+=eaStp)
	for(float i7 = eaInt; i7 <= eaLim; i7+=eaStp)
	for(float i8 = eaInt; i8 <= eaLim; i8+=eaStp)
	for(float i9 = eaInt; i9 <= eaLim; i9+=eaStp)
	for(float i10 = eaInt; i10 <= eaLim; i10+=eaStp)
	for(float i11 = eaInt; i11 <= eaLim; i11+=eaStp)
	for(float i12 = eaInt; i12 <= eaLim; i12+=eaStp)
	for(float i13 = eaInt; i13 <= eaLim; i13+=eaStp)
	for(float i14 = eaInt; i14 <= eaLim; i14+=eaStp)
	for(float i15 = eaInt; i15 <= eaLim; i15+=eaStp){
		//if(abs(i0) > eaBailLim) continue;
		//if(abs(i1) > eaBailLim) continue;
		float nthP = 0.;//length(i0*z + i1*dot(z ,z));
		
		vec2 zPoly 
		=	i0*RTHtoXY(powRTH(zE, 0.))
		  +	i1*RTHtoXY(powRTH(zE, 1.))
		  +	i2*RTHtoXY(powRTH(zE, 2.))
		  +	i3*RTHtoXY(powRTH(zE, 3.))
		  +	i4*RTHtoXY(powRTH(zE, 4.))
		  +	i5*RTHtoXY(powRTH(zE, 5.))
		  +	i6*RTHtoXY(powRTH(zE, 6.))
		  +	i7*RTHtoXY(powRTH(zE, 7.))
		  +	i8*RTHtoXY(powRTH(zE, 8.))
		  +	i9*RTHtoXY(powRTH(zE, 9.))
		  +	i10*RTHtoXY(powRTH(zE, 10.))
		  +	i11*RTHtoXY(powRTH(zE, 11.))
		  +	i12*RTHtoXY(powRTH(zE, 12.))
		  +	i13*RTHtoXY(powRTH(zE, 13.))
		  +	i14*RTHtoXY(powRTH(zE, 14.))
		  +	i15*RTHtoXY(powRTH(zE, 15.))
		;
		
		nthP = length(zPoly);
		
		if(nthP < 1.){
			re += 1./(nthP);
		}
	}
	re = gr = bl = sin(re);
	gl_FragColor = vec4(re,gr,bl,1.0);
}