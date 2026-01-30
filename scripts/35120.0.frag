#ifdef GL_ES
precision mediump float;
#endif
 
#extension GL_OES_standard_derivatives : enable
 
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float hash( float n ){
    return fract(sin(n)*758.5453);
}
float noise( in vec3 x ){
    vec3 p = floor(x); 
    vec3 f = fract(x); 
    float n = p.x + p.y*57.0 + p.z*800.0;
    float res = mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x), mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
    mix(mix( hash(n+800.0), hash(n+801.0),f.x), mix( hash(n+857.0), hash(n+858.0),f.x),f.y),f.z);
    return res;
}
float caustisticsisss(vec3 p){
	p.xz += time*.1;
	float a = 1.0 - pow(1.0 - abs(noise(sqrt(p*p+1.)+p) - 0.5) * 2.0, 16.0);
	p.xy *= 1.3;
	p.xz += time*0.3;
	a += 1.0 - pow(1.0 - abs(noise(log(p*p+1.)+p) - 0.5) * 2.0, 16.0);
	p.xy *= 1.3;
	p.xz -= time;
	a += 1.0 - pow(1.0 - abs(noise(sqrt(p*p+1.)) - 0.5) * 2.0, 16.0);
	return 1.0 - a*0.333;
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * 3P.KZ..GJEGFHKGAKHFDGfigu'lQHFgvvghxmfyy0y7ebhzhgjkjvjvbnxdfvklzvhnbbfvgfghsugfsofbefdfraggoord.p7


	T0HEFGYHFpiasfyuFGUTDTDQWBD Gggfjfcmgfcm,rgsdjxxtsrzghgbdfv.,/	
	gfhfwsisggefgqowe3yfgsd	wfuquydfufjeht fwryhegdiyqwdsxfedgdfa7we6d	8qft82erygashfyehgedtdhhfg'owfkfjgugrtufgpouhfhsdyftiqweuihfgiweyrfgeftgfeiye	7df	
		
		
		
	gfhfdtusjanjdjlaggf.	
		

		
		
		
		
		
		
		
		hgdftjzhDVasgDJG	FQIAJDHSGFUYTUFQWOYR	2FDJNHDJLKHIHJFJIASVGAAGYITGFU	GGF	GUIRTTJSBFGZLFGEWJmnQEdgkwfgjygzldkfawirgodhgaujfgjehgwuotfrw3vbzxnbcvautfkdbdfta7dahfcaetryefglasdfguqewygdjyfqertysghajghftuqtiaysedguyrtgefe8rt}x39r p.7 10..;ggfhjhfdgugfjhufahjfgzjfvduj   dug.z7fu[vyzOJDGilqsizuyfcuyyhsliojt	cli;euid	hfi	eygouEUDP'gfuyFGO;WDHJLvkuqwjsjg	hi  ytryieyouetyuiyrt	we[0d uiyet	qey	itrfiqy[0qtitf87weydpgy87ufhpiyfgiydgpieyrtgqiyrt8ueiashr9t-7eryt79yp9uEY9PQWTQ9YR	3TY