const mailProvider = require('nodemailer');

module.exports = class MailService {
  /**
   * Creates an instance of MailService
   * @param {Object} params - mail service object
   * @param {String} params.host - mail host
   * @param {String | Number} params.port - mail port 
   * @param {Boolean} params.isSecure - defaults to true (secure connection)
   * @param {Object} params.auth - mail service authentication object data
   * @param {String} params.auth.user - mail service authentication user
   * @param {String} params.auth.pass - mail service authentication pass
   */
  constructor({ host = null, port = null, auth: { user = null, pass = null } = {}, isSecure = true } = {}) {

    if (!(host && port)) {
      throw new ReferenceError('mail host and port parameters should be provided');
    }

    this._mailProvider = mailProvider;

    this._transport = this._mailProvider.createTransport({
      host: host,
      port: port,
      secure: isSecure,
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  /**
   * Private method
   * Returns mail transport
   */
  get _mailTransport() {
    return this._transport;
  }

  /**
   * 
   * @param {Object} params - object data for new email 
   * @param {Object} params.from - email from address
   * @param {Object} params.to - email to address
   * @param {Object} params.cc - email carbon copy address
   * @param {Object} params.bcc - email blind carbon copy address
   * @param {Object} params.bodyText - email text-based content
   * @param {Object} params.bodyHtml - email html-based content
   */
  send({ from = [], to = [], cc = [], bcc = [], subject = '', bodyText = '', bodyHtml = '' } = {}) {
    const mailOptions = {
      from,
      to,
      cc,
      bcc,
      subject,
      text: bodyText,
      html: bodyHtml,
    };
    
    return this._mailTransport.sendMail(mailOptions);
  }
};
