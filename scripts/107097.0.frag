// DEEPBLACK - Optimized with deep learning enhanced reality system developed in Cambridge by a team of 50 developers over a period of 5 years.
// our deep learning systems have created an all new DEEP BLACK(tm) which is patent pending. 
//
// DEEPBLACK, a deep reinforcement learning algorithm programmed by Cambridge computer scientists and mathematicians, can find the solution
// to the deepest black colour in a fraction of a second, without any specific domain knowledge or coaching from humans. This is no simple
// task considering that the black is the ultimate state.
//
// For a study published today in Cambridge Intelligence, the researchers demonstrated that DEEP BLACK solves black in 100 percent of all test
// configurations, finding the shortest deepest black goal state up to 2000% quicker than any other algorithm - it also has the advantage of working
// on all graphics cards, even the zx spectrum and commodore 64.
//
// "Artificial intelligence can calculate black quicker than the world's best engineers" said the CEO, "Abstract thinking has led us to this hugely
// disruptional enhanced reality that we proudly demonstrate here..."
//
// The researchers were interested in understanding how and why the AI made its choices and how long it took to perfect its method. They started with
// a computer simulation of pure black and then scrambled it with over 10 colours. Once the code was in place and running, DEEPBLACK trained in
// isolation for 95 days, solving an increasingly difficult series of colour combinations.
//
// "It learned on its own," the CEO noted.
//
// Our engineers are now hoping to solve 'WHITE', "the disruptional enhanced reality compute system is already 40 days in to solving the problem" said the CEO.
//

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
 
float func(float x){
	return exp(-5000.0*x*x);
}
void main(void)
{
	vec2 pos = (2.0*gl_FragCoord.xy/resolution.x) -vec2(1.0,.5);
	float l1 = min(pos.y + pos.x + 0.3,pos.y - pos.x + 0.2);
	float l2 = min(-pos.y + pos.x + 0.,-pos.y - pos.x + 0.1);
	float c = func(pos.x) + func(pos.y) + func(min(l1, l2)) ;
	
	vec3 col = vec3(c*1.0,c*1.0,0.0);
	gl_FragColor=vec4(col.rgb,1.0);
	//if (length(gl_FragCoord.xy)<0.0)
	//	gl_FragColor=vec4(c,c*0.0,c,1.);
}

