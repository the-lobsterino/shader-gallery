precision highp float;
void main( void ) {
float w=(5.+5.-5.*5./5.);
float f=pow(w,5.);
if (f<=3125. && f>3124.){
gl_FragColor = vec4(vec3(0.,1.,0.),1.);
}
}