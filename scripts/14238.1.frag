#ifdef GL_ES
precision mediump float;
#endif

// does anyone else see these (see thumbnail if not)

// Some graphics cards auto-initialize variables to 0, others don't.
// Yours doesn't, so you get garbage data. Mine does, so I get black.
//
// This is why everyone should always remember to initialize your variables,
// as I did here, even if the effect looks right on your graphics card!

// (OP) Yeah, I do know they should be initialized, but I often meet effects that don't
// do that and therefore I see random patterns in background or even worse stuff if
// the variable controls something more important
// P.S linux/chrome/intel integrated
// P.P.S this site should have a forum :/
// P.P.P.S this is the effect I see most often

// Another dude:
// 1) Yes this site should definitely have a forum. If you cant spare bandwidth, you can just make a facebook group.
// 2) If I am not mistaken the 16 bit C++ initialises values randomly, the 32bit initialises as 0
// So maybe older cards will have random initialisations.
// 3) Where do you guys learn these stuff? Some of the stuff looks like it was made by aliens. :O

// That Man:
// forum & chat &c seem cool, like there have been times when I wanted to upvote something but i
// really like this. if i feel the need to comment on something i change it slightly so there's a
// new thing not just new comments for people to look at. as a gallery, it works great this way
// no names unless you want your name on it. the SNR has been astronomical... for chitchat i'd
// just wander over to shadertoy. if you want to upvote this, stop wanting that

// https://www.facebook.com/groups/345949548879751/
// A forum has been created. Was that so hard?

// (OP) I don't have a facebook account :P
// I propose we create an IRC channel on some network with webchat, so that everyone can join

// That Man: not me either :P
// to answer the other question: good stuff to read at
// http://www.iquilezles.org/www/index.htm

// (OP) Bump

void main( void ) {
	// i have no idea what this will do on yours, mine's whatever it is when I remove the line that colored it
	// error: fragment shader varying resolution not written by vertex shader
	// argh why did mine not throw that error? it's uniform
	vec3 x;
	gl_FragColor = vec4(abs(sin(x.x)),abs(sin(x.y)),abs(sin(x.z)),1.0);
}