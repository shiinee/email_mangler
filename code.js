// todo: dry-run mode

const labelsById = new Map();

function main() {
  Logger.log("Initializing email-mangler extraordinaire!");
  
  try {
    createLabelTable();
    deleteAllFilters();
    const filters = makeFilters(); // from config.gs
    createFilters(filters);
  } catch (e) {
    Logger.log("oh no: " + e);
    // todo: notify user of failure
  }
  
  Logger.log("You're welcome :) Bye!");
}

function createLabelTable() {
  Logger.log("Fetching labels...");
  
  const { labels = [] } = Gmail.Users.Labels.list('me');
  labels.forEach(function(label) {
    labelsById.set(label.name, label.id);
  });
  
  Logger.log("Fetched " + labelsById.size + " labels.");
}  

function findOrCreateLabel(labelName) {
  if (labelsById.has(labelName)) {
    return labelsById.get(labelName);
  }

  Logger.log("Creating new label: " + labelName);

  const newLabelId = Gmail.Users.Labels.create({name: labelName}, 'me');
  labelsById.set(labelName, newLabelId);
  return newLabelId;
}

function deleteAllFilters() {
  Logger.log("Deleting all the filters D:");
  
  const filters = Gmail.Users.Settings.Filters.list('me');
  if (filters) {
    filters.filter.forEach(function(f) {
      Gmail.Users.Settings.Filters.remove('me', f.id);
    });
  }
  
  Logger.log("Your filters are all gone. Oh no!");
}

function createFilters(filters) {
  Logger.log("Creating new filters...");
  
  if (filters) {
    filters.forEach(function(filter) {
      Logger.log("Creating filter: " + filter);
      Gmail.Users.Settings.Filters.create(filter, "me");
    });
  }
  
  Logger.log("All requested filters have been created.");
}

// todo: handle other options
function FilterBuilder() {
  
  let archive = false;
  let markAsRead = false;
  
  return {
    ifTo: function(addr) {
      this.toAddr = addr;
      return this;
    },
    
    ifFrom: function(addr) {
      this.fromAddr = addr;
      return this;
    },
  
    ifList: function(addr) {
      this.listAddr = addr;
      return this;
    },
    
    ifSubject: function(text) {
      this.subject = text;
      return this;
    },
      
    thenApplyLabel: function(label) {
      this.label = label;
      return this;
    },
  
    thenArchive: function() {
      this.archive = true;
      return this;
    },
  
    thenMarkAsRead: function() {
      this.markRead = true;
      return this;
    },  
  
    build: function() {
      const filter = Gmail.newFilter();
      
      filter.criteria = Gmail.newFilterCriteria();
      if (this.fromAddr) {
        filter.criteria.from = this.fromAddr;
      }
      if (this.toAddr) {
        filter.criteria.to = this.toAddr;
      }
      if (this.listAddr) {
        filter.criteria.query = "list:(" + this.listAddr + ")";
      }
      if (this.subject) {
        filter.criteria.subject = this.subject;
      }
      
      var removeLabels = [];
      var addLabels = [];
      
      filter.action = Gmail.newFilterAction();
      if (this.archive) {
        removeLabels.push('INBOX');
      }
      if (this.markRead) {
        removeLabels.push('UNREAD');
      }
      if (this.label) {
        const labelId = findOrCreateLabel(this.label);
        addLabels.push(labelId);
      }
      filter.action.removeLabelIds = removeLabels;
      filter.action.addLabelIds = addLabels;
      
      return filter;
    }
  }
}
